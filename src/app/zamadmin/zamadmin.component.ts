import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from './../post.service';

@Component({
  selector: 'app-zamadmin',
  templateUrl: './zamadmin.component.html',
  styleUrls: ['./zamadmin.component.scss'],
})
export class ZamadminComponent implements OnInit {
  constructor(public postService: PostService, public router: Router) {}

  ngOnInit(): void {}
}
