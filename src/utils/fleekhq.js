import fleekStorage from '@fleekhq/fleek-storage-js';

const apiKey = 't811df4atuATScetL0CdGg==';
const apiSecret = 'PknQXUfoE87VjMO3h5yXnc0i3xKGA1qU230IZ0WaVUg=';

export const uploadedFile = async (fileData) => {
  await fleekStorage.upload({
    apiKey,
    apiSecret,
    key: 'my-file-key' + '-' + 1,
    ContentType: 'image/png',
    data: fileData,
    httpUploadProgressCallback: (event) => {
      console.log(Math.round((event.loaded / event.total) * 100) + '% done');
    },
  });
};

export const getFile = async () => {
  const myFile = await fleekStorage.get({
    apiKey,
    apiSecret,
    key: 'my-file-key' + '-' + 1,
    getOptions: ['data'],
  });
  console.log('myFile', myFile);
};
