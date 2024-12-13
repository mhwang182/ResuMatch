import { HttpInterceptorFn } from '@angular/common/http';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {

  const accessToken = localStorage.getItem('token');

  if (!accessToken) {
    return next(req);
  }

  const reqWithHeader = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${JSON.parse(accessToken)}`),
  });
  //TODO: check if token valid, refresh if necessary. logout if both invalid

  return next(reqWithHeader);
};
