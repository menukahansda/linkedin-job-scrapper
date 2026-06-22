import {X} from 'lucide-react';
export function KeywordChip({keyword}){
    return (
        <>
            <span className="keyword-chip" >
                {keyword}
                <X color='white' size={10}/>
            </span>
        </>
    )
};