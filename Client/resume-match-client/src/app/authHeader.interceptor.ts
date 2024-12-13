import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject, catchError, filter, lastValueFrom, switchMap, take, throwError } from "rxjs";
import { AuthService } from "./services/auth.service";
import { error } from "console";

@Injectable()
export class AuthHeaderInterceptor implements HttpInterceptor {

    private authService: AuthService = inject(AuthService);

    // private refreshTokenSubject = new Subject<string | null>();

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const accessToken = localStorage.getItem('token');

        //ignore login and signup requests
        if (req.url.includes("login") || req.url.includes("signup")) {
            return next.handle(req);
        }

        if (!accessToken) {
            return next.handle(req);
        }

        const reqWithHeader = this.addAccessToken(req, JSON.parse(accessToken));

        //TODO: check if token valid, refresh if necessary. logout if both invalid

        return next.handle(reqWithHeader).pipe(catchError((err) => {
            if (err instanceof HttpErrorResponse && err.status === 401) {
                return this.refreshTokenAndRetry(accessToken, req, next);
            }
            return next.handle(req);
        }));

    }

    private refreshTokenAndRetry(accessToken: string, req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
            return next.handle(req);
        }

        return this.authService.refreshTokens(JSON.parse(accessToken), JSON.parse(refreshToken)).pipe(
            switchMap((res) => {
                if (res.accessToken) {
                    localStorage.setItem('token', JSON.stringify(res.accessToken));

                    const reqWithHeader = this.addAccessToken(req, res.accessToken);

                    return next.handle(reqWithHeader);
                } else {
                    //logout
                    this.authService.logout();
                }
                return next.handle(req)
            })
        )
    }

    private addAccessToken(req: HttpRequest<any>, accessToken: string) {
        return req.clone({
            headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
        });
    }

}