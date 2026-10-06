import { useEffect } from 'react';

const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} | ReWear` : 'ReWear | Give Clothes a Second Life';
  }, [title]);
};

export default useDocumentTitle;
