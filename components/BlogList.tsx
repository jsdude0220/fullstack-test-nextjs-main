
import { useAuth } from "context/AuthUserContext";
import MainLayout from "layout/MainLayout";
import router from "next/router";
import React, {useState, useEffect} from "react";

import BlogCard from 'components/BlogCard';

import Firebase from 'libs/firebase';



export const BlogList = ({blogs, onOpen, onSelect})=>{

    if(blogs){
        return <>
        {
            blogs.map((blog, index: number)=>{
        
                return <BlogCard data={blog} key={index} onClick={()=>{
                    onOpen();                            
                    onSelect({...blog, id: blog.id});
                }}/>
            })
        }
        </>
    }
    return null;
}