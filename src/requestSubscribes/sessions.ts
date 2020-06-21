// Нужна ли проверка на токен?
// let authToken = null;
window.request.subscribe('api.arcadia.pinnacle.com/0.1/sessions', (
  url,
  data,
  method /* , 
  fullUrl */
) => {
  try {
    if (method === 'delete' /* && authToken */) {
      worker.Islogin = false;
      worker.JSLogined();
      console.log('Пользователь вышел');
      // authToken = null;
      return;
    }
    if (data === '') return;
    const json = JSON.parse(decodeURIComponent(data));
    if (json.username) {
      worker.Islogin = true;
      worker.JSLogined();
      console.log('Пользователь авторизован');
      // if (json.token) {
      //     authToken = json.token;
      // }
      return;
    }
  } catch (e) {
    console.error(`Ошибка обработки ответа от ${url} - ${e}`);
    if (e instanceof URIError) {
      console.error(`Ошибка декодирования URI - ${data}`);
    } else if (e instanceof SyntaxError) {
      console.error(`Ошибка парсинга JSON - ${decodeURIComponent(data)}`);
    }
  }
});
