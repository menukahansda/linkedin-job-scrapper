import {X} from 'lucide-react';
export function KeywordChip({keyword, handleDelete}){
    return (
        <>
            <span className="keyword-chip" >
                {keyword}
                <X onClick={()=> handleDelete(keyword)} size={10} className="opacity-60 hover:opacity-100 cursor-pointer"/>
            </span>
        </>
    )
};