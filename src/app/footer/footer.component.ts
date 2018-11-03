import { Component, OnInit } from '@angular/core';
import { ParametersService } from '../parameters.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  getText():string{
    return ParametersService.FooterText;
  }
}
