import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-htmlexample',
  templateUrl: './htmlexample.component.html',
  styleUrls: ['./htmlexample.component.css']
})
export class HtmlexampleComponent implements OnInit {

  items = [
    "Apple",
    "Mango",
    "Banana",
    "Orange"
  ]
  constructor() { }

  ngOnInit() {
  }

}
