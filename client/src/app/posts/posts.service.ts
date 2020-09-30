import {Post} from './post.model';
import {Subject} from 'rxjs';
import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class PostsService{
  // private postUpdated = new Subject<Post[]>();
    posts=[];
   constructor(private http:HttpClient){

    }

   getPosts(postsPerPage,currentPage){
       // Spread operator is used to avoid passing the reference of our array, so that others cannot change it
      // return [...this.posts];
      let queryParameter = `?pageSize=${postsPerPage}&currentPage=${currentPage}`
     return this.http.get("http://localhost:3000/api/posts"+queryParameter);
   }

   getPostById(postId){
    return this.http.get("http://localhost:3000/api/post/"+postId);
   }

//    getPostUpdateListener(){
//        return this.postUpdated.asObservable();
//    }

   addPost(post){
       console.log("postData========>",post);
        return this.http.post("http://localhost:3000/api/posts",post);
      // this.postUpdated.next([...this.posts]);
   }

   updatePost(postId,post){
    return this.http.put("http://localhost:3000/api/post/"+postId,post);
  // this.postUpdated.next([...this.posts]);
}

   deletePost(postId){
       return this.http.delete("http://localhost:3000/api/posts/"+postId);
   }
}
