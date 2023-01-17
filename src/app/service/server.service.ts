import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscriber, throwError } from 'rxjs';
import { tap,catchError } from 'rxjs/operators'
import { Status } from '../enum/status.enum';
import { CustomResponse } from '../interface/custom-response';
import { Server } from '../interface/server';

@Injectable({providedIn: 'root' })
export class ServerService {

  private readonly apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  /*getservers(): Observable<CustomResponse> {
    return this.http.get<CustomResponse>('http://localhost:8080/server/list');
  }*/

  servers$ = <Observable<CustomResponse>> 
  this.http.get<CustomResponse>('http://localhost:8080/server/list')
  .pipe(
    tap(console.log),
    catchError(this.handleerror)
  );

  server$ = (server: Server) => <Observable<CustomResponse>> 
  this.http.post<CustomResponse>('${this.apiUrl}/server/save',server)
  .pipe(
    tap(console.log),
    catchError(this.handleerror)
  );

  ping$ = (ipAddress: String) => <Observable<CustomResponse>> 
  this.http.get<CustomResponse>('${this.apiUrl}/server/save/${ipAddress}')
  .pipe(
    tap(console.log),
    catchError(this.handleerror)
  );

  filter$ = (status: Status,response:CustomResponse) => <Observable<CustomResponse>> 
  new Observable<CustomResponse>(
    Subscriber => {
      console.log(response);
      Subscriber.next(
        status === Status.ALL ? { ...response,message: 'Servers filtered by ${stattus} status'} :
        {
          ...response,
          message: response.data.servers
          .filter(server => server.status === status).length > 0 ? 
          'Servers filtered by ${stattus === Status.SERVER_UP ? "SERVER_UP" : "SERVER_DOWN"} status' :
          'No servers of ${status} found',
          data: {
            servers: response.data.servers
            .filter(server => server.status === status)
          }
        }
      );
      Subscriber.complete();
    }
  )
  .pipe(
    tap(console.log),
    catchError(this.handleerror)
  );

  delete$ = (serverId: number) => <Observable<CustomResponse>> 
  this.http.delete<CustomResponse>('${this.apiUrl}/server/delete/${serverId}')
  .pipe(
    tap(console.log),
    catchError(this.handleerror)
  );

  handleerror(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError('An error occured - Error code: ${error.status}');
  }


}
