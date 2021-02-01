export const appendHttp = function (url: string) {
  if (!url.includes('http://')) return 'http://'.concat(url);
};
