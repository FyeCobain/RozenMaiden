import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'rm-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {}
