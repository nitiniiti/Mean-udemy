import { Component,EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {Post} from '../post.model';
import { PostsService } from '../posts.service';
import {mimeType} from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls:['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
    enteredTitle="";
    enteredContent="";
    mode = "create";
    postId:string;
    post = {title:"",content:"",imagePath:""};
    imagePreview:string;
    isLoading = false;
    form:FormGroup;

    constructor(private postsService:PostsService,private route:ActivatedRoute,private router:Router){

    }

    ngOnInit(){
      this.form = new FormGroup({
        "title":new FormControl(null,{validators:[Validators.required]}),
        "content":new FormControl(null,{validators:[Validators.required]}),
        "image":new FormControl(null,{validators:[Validators.required],asyncValidators:[mimeType]})
      });
      this.route.paramMap.subscribe((paramMap:ParamMap)=>{
        this.isLoading = true;
        if(paramMap.has("postId")){
          this.mode = "edit";
          this.postId = paramMap.get("postId");
          console.log(this.postId);
          this.postsService.getPostById(this.postId).subscribe((postData:any)=>{
              this.isLoading = false;
              this.post = postData.post;

              this.form.setValue({
                'title':this.post.title,
                'content':this.post.content,
                'image':this.post.imagePath
              });
          })
        }else{
          this.isLoading = false;
          this.mode = "create";
          this.postId = null;
        }
      })
    }

    onSavePost(){
        // const post:Post = {
        //   title:this.form.value.title,
        //   content:this.form.value.content
        // }
        const postData = new FormData();
        postData.append("title",this.form.value.title);
        postData.append("content",this.form.value.content);
       // debugger;
        if(typeof(this.form.value.image) === 'object'){
          postData.append("image",this.form.value.image,this.form.value.title);
        }else{
          postData.append("imagePath",this.form.value.image);
        }
        this.isLoading = true;
        // debugger;
        if(this.mode == "create"){
          this.postsService.addPost(postData).subscribe((postData:any)=>{
            this.postsService.posts.push(postData.post);
            this.isLoading = false;
            this.form.reset();
            this.router.navigate(["/"]);
        });
        }else{
          this.postsService.updatePost(this.postId,postData).subscribe((postData:any)=>{
            this.isLoading = false;
            this.form.reset();
            this.router.navigate(["/"]);
        });
        }
    }

    onImagePicked(event:Event){
        const file = (event.target as HTMLInputElement).files[0];
        this.form.patchValue({image:file});
        this.form.get("image").updateValueAndValidity();
        console.log(file);
        console.log(this.form);

        const reader = new FileReader();
        reader.onload=()=>{
          this.imagePreview = reader.result as string;
        }

        reader.readAsDataURL(file);
    }
}
