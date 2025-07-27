import React, { useState, useEffect } from "react";
import ImageUploading from "react-images-uploading";

function UploadImage({handleProductImage, id, product_image}) {
  const [images, setImages] = React.useState([]);
  const maxNumber = 1;
  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    // console.log(imageList, addUpdateIndex);
    setImages(imageList);
    handleProductImage(imageList, id);
  };

 useEffect(() => { 
    if (product_image) {
        const imageList = [{"data_url": product_image}];
        onChange(imageList, 0);
    }
}, [product_image]);

  return (
    <div className="App">
      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
        acceptType={["jpg", "png", "jpeg"]}
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps
        }) => (

          <div className="notes-border" style={{marginTop: '10px'}}>
            <button className="drag-and-drop"
              style={isDragging ? { color: "red" } : null}
              onClick={onImageUpload}
              {...dragProps}
            >
              Click or Drop here
            </button>
            <div style={{marginTop: '5px'}}>&nbsp;</div>
            {imageList.map((image, index) => (
              <div key={index} className="image-item">
                <img src={image.data_url} alt="" width="100" />
                <div>
                  <span className="black-text" onClick={() => onImageUpdate(index)}>Change </span>
                  <span className="black-text" onClick={() => onImageRemove(index)}> Remove</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </ImageUploading>
    </div>
  );
}

export default UploadImage;