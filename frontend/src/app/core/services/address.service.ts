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

    getAddressById(id: number): Observable<Address> {
        return this.http.get<Address>(`${this.apiUrl}/${id}`);
    }

    getDefaultAddress(): Observable<Address> {
        return this.http.get<Address>(`${this.apiUrl}/default`);
    }

    createAddress(address: AddressRequest): Observable<Address> {
        return this.http.post<Address>(this.apiUrl, address);
    }

    updateAddress(id: number, address: AddressRequest): Observable<Address> {
        return this.http.put<Address>(`${this.apiUrl}/${id}`, address);
    }

    deleteAddress(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    setDefaultAddress(id: number): Observable<Address> {
        return this.http.patch<Address>(`${this.apiUrl}/${id}/default`, {});
    }
}
