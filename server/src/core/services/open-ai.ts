import OpenAI from 'openai';

import config from '../../config';

const openai = new OpenAI({
  apiKey: config.openAi.api_key,
});
//TODO КУДА переместить файл?
export default openai;
