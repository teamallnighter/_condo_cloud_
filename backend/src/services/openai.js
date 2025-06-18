const axios = require('axios');
const { v4: uuid } = require('uuid');
const RoleService = require('./roles');
const config = require('../config');

module.exports = class OpenAiService {
  static async getWidget(payload, userId, roleId) {
    const response = await axios.post(
      `${config.flHost}/${config.project_uuid}/project_customization_widgets.json`,
      payload,
    );

    if (response.status >= 200 && response.status < 300) {
      const { widget_id } = await response.data;
      await RoleService.addRoleInfo(roleId, userId, 'widgets', widget_id);
      return widget_id;
    } else {
      console.error('=======error=======', response.data);
      return { value: null, error: response.data };
    }
  }

  static async askGpt(prompt) {
    if (!config.gpt_key) {
      return {
        success: false,
        error: 'API key is required',
      };
    }
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o',
          messages: [{ role: 'user', content: prompt }],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.gpt_key}`,
          },
        },
      );

      if (response.status >= 200 && response.status < 300) {
        return {
          success: true,
          data: response.data.choices[0].message.content,
        };
      } else {
        console.error('Error asking question to ChatGPT:', response.data);
        return {
          success: false,
          error: response.data,
        };
      }
    } catch (error) {
      console.error(
        'Error asking question to ChatGPT:',
        error.response?.data || error.message,
      );
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  }
};
