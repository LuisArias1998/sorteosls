import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'
import { IBoletos } from '../models/IBoletos';

@Injectable({
  providedIn: 'root'
})
export class SendEmailService {

  //baseUrl: string = "http://localhost:3200/"
  baseUrl: string = "https://sorteos-ls-service.onrender.com/"
  constructor(private http: HttpClient) { }

  async sendEmail(boleto: IBoletos): Promise<any> {
     const url = this.baseUrl+"email-sender"
    return this.http.post<IBoletos>(url, boleto).toPromise();
  }

  async postClient(cliente: IBoletos): Promise<any> {
    const url = this.baseUrl+"cliente"
    return this.http.post<IBoletos>(url, cliente).toPromise();
  }

  async getClients():Promise<any>{
    return this.http.get<IBoletos>(this.baseUrl).toPromise();
  }
}
