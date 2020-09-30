import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import {Post} from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit,OnDestroy {

  posts=this.postsService.posts;
  isLoading = false;
  totalPosts = 10;
  postsPerPage = 2;
  pageSizeOptions=[1,2,5,10];
  // private postsSub:Subscription; 

  constructor(private postsService:PostsService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage,1).subscribe((postData:any)=>{
      this.isLoading = false;
      this.posts = postData.posts;
    });
    // this.postsSub=this.postsService.getPostUpdateListener().subscribe((posts:Post[])=>{
    //   this.posts = posts;
    // })
  }

  ngOnDestroy(){
    // this.postsSub.unsubscribe();
  }

  onDelete(postId){
    this.postsService.deletePost(postId).subscribe((response:any)=>{
      console.log("response",response.message);
      this.posts = this.posts.filter((element:any)=>{
          return (element._id != postId);
      })
    })
  }

  OnChangePage(pageData:PageEvent){
    console.log(pageData);
    this.isLoading = true;
    this.postsService.getPosts(pageData.pageSize,(pageData.pageIndex+1)).subscribe((postData:any)=>{
      this.isLoading = false;
      this.posts = postData.posts;
    });
  }

}
