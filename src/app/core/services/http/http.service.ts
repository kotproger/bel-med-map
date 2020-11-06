import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { httpMethods } from '../../../constants';

import { BaseRequestConfig, RequestConfig } from './http.models';

const apiUrl = './php_api/';

interface ObjectWithStringValues {
    [key: string]: string;
}

@Injectable({
    providedIn: 'root',
})
export class HttpService {
    private headers: HttpHeaders;
    private params: HttpParams;

    constructor(private httpClient: HttpClient) {
        this.resetHeadersAndParams();
    }

    get({ url, baseUrl = apiUrl,  body = null}: RequestConfig): Observable<object> {
        return this.request({ url, baseUrl, body, method: httpMethods.GET });
    }

    post({ url, baseUrl = apiUrl, body = null }: RequestConfig): Observable<object> {
        return this.request({ url, baseUrl, body, method: httpMethods.POST });
    }

    put({ url, baseUrl = apiUrl, body = null }: RequestConfig): Observable<object> {
        return this.request({ url, baseUrl, body, method: httpMethods.PUT });
    }

    remove({ url, baseUrl = apiUrl }: RequestConfig): Observable<object> {
        return this.request({ url, baseUrl, method: httpMethods.DELETE });
    }

    setHeader(key: string, value?: any): HttpService {
        this.headers = this.headers.append(key, value);
        return this;
    }

    removeAllHeaders(): HttpService {
        this.headers.keys().forEach((key) => {
            this.headers = this.headers.delete(key);
        });

        return this;
    }

    setParam(key: string, value: string): HttpService {
        this.params = this.params.append(key, value);
        return this;
    }

    setParams(params: ObjectWithStringValues): HttpService {
        Object.keys(params).forEach(key => {
            if (params[key]) {
                this.params = this.params.append(key, params[key]);
            }
        });
        return this;
    }

    private request({ url, baseUrl = apiUrl, body = null, method = httpMethods.GET }: BaseRequestConfig): Observable<object> {
        const options = {
            body,
            headers: this.headers,
            params: this.params
        };
        const absoluteUrl = `${baseUrl}${url}`;
        const request = this.httpClient.request(method, absoluteUrl, options);
        this.resetHeadersAndParams();

        return request;
    }

    private resetHeadersAndParams(): void {
        this.headers = new HttpHeaders();
        this.params = new HttpParams();
        this.setDefaultHeaders();
    }

    private setDefaultHeaders(): void {
        this.setHeader('Content-Type', 'application/json');
    }
}
