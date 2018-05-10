import React from "react";
//import ReactDOM from "react-dom";
import LabelItem from "./LabelItem";

/**
 * Given a DOM element, searches it for <img> tags and checks if all of them
 * have finished loading or not.
 * @param  {Element} parentNode
 * @return {Boolean}
 */
function imagesLoaded(parentNode) {
  const imgElements = [...parentNode.querySelectorAll("img")];
  for (let i = 0; i < imgElements.length; i += 1) {
    const img = imgElements[i];
    if (!img.complete) {
      return false;
    }
  }
  return true;
}

class Gallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }
  
  componentDidMount() {
  }
  
  handleImageChange = () => {
    this.setState({
      loading: !imagesLoaded(this.galleryElement),
    });
  }
  
  renderImage(imageUrl) {
    return (
      <div key={imageUrl}>
        <
          img src={imageUrl}
          onLoad={this.handleImageChange}
          onError={this.handleImageChange}
          alt=""
        />
        <LabelItem label={this.props.imageLabels} />
      </div>
    );
  }
  
  renderSpinner() {
    if (!this.state.loading) {
      // Render nothing if not loading
      return null;
    }
    return (
      <span className="loader" />
    );
  }
  
  render() {
    var hide = this.props.imageUrls.length === 0;
    var galleryItem;
    if(typeof this.props.imageLabels === 'string'){
      galleryItem = this.props.imageUrls.map(imageUrl => this.renderImage(imageUrl));
    }
    else {
      galleryItem = this.props.imageUrls.map((currElement, index) => {
        return <div key={currElement}>
            <
              img src={currElement}
              onLoad={this.handleImageChange}
              onError={this.handleImageChange}
              alt=""
            />
            <LabelItem label={this.props.imageLabels[index]} />
          </div>
      });
    }
    return (
      <div className="gallery" ref={element => { this.galleryElement = element; }}>
        {!hide && this.renderSpinner()}
        <div className="images">
          {!hide && galleryItem}
        </div>
      </div>
    );
  }
}

export default Gallery;