import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Address, AddressRequest } from '../models';

@Injectable({
    providedIn: 'root'
})
export class AddressService {
    private readonly apiUrl = `${environment.apiUrl}/addresses`;

    constructor(private http: HttpClient) { }

    getAddresses(): Observable<Address[]> {
        return this.http.get<Address[]>(this.apiUrl);
    }

    createAddress(address: AddressRequest): Observable<Address> {
        return this.http.post<Address>(this.apiUrl, address);
    }
}
