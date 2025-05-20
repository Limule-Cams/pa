import { Component } from '@angular/core';
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";

export enum AuthScreens {
  LOGIN_SCREEN = "LOGIN_SCREEN",
  REGISTER_SCREEN = "REGISTER_SCREEN"
}

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [LoginComponent, RegisterComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent  {

  defaultScreen: AuthScreens = AuthScreens.LOGIN_SCREEN;
  protected AuthScreens = AuthScreens;

  onScreenChangeClick(screen: AuthScreens): void {
    this.defaultScreen = screen;
  }

}
