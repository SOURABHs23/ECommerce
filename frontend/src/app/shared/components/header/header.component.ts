import { Component, inject } from '@angular/core';

import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService, CartService } from '../../../core/services';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  authService = inject(AuthService);
  cartService = inject(CartService);
}
