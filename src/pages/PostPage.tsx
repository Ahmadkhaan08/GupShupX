import { useParams } from "react-router"
import { PostDetails } from "../components/PostDetails"

export const PostPage=()=>{
    const {id}=useParams<{id:string}>()
    return (

        <div className="pt-"><PostDetails postId={Number(id)}/></div>
    )
}