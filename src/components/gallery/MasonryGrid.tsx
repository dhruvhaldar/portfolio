"use client";
import React, { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import { SmartImage } from "@/once-ui/components";
import styles from "./Gallery.module.scss";

const fetchFlickrPhotos = async () => {
  const apiKey = process.env.NEXT_PUBLIC_FLICKR_API_KEY;
  const userId = process.env.NEXT_PUBLIC_FLICKR_USER_ID;
  const response = await fetch(`https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&user_id=${userId}&format=json&nojsoncallback=1`);
  const data = await response.json();
  return data.photos.photo.map(photo => ({
    src: `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`,
    alt: photo.title,
    orientation: 'horizontal', // You might need to determine this based on photo dimensions
  }));
};

export default function MasonryGrid() {
  const [photos, setPhotos] = useState<{ src: string; alt: string; orientation: string }[]>([]);

  useEffect(() => {
    const loadPhotos = async () => {
      const flickrPhotos = await fetchFlickrPhotos();
      setPhotos(flickrPhotos);
    };
    loadPhotos();
  }, []);

  const breakpointColumnsObj = {
    default: 4,
    1440: 3,
    1024: 2,
    560: 1,
  };

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className={styles.masonryGrid}
      columnClassName={styles.masonryGridColumn}
    >
      {photos.map((image, index) => (
        <SmartImage
          priority={index < 10}
          sizes="(max-width: 560px) 100vw, (max-width: 1024px) 50vw, (max-width: 1440px) 33vw, 25vw"
          key={index}
          radius="m"
          aspectRatio={image.orientation === "horizontal" ? "16 / 9" : "9 / 16"}
          src={image.src}
          alt={image.alt}
          className={styles.gridItem}
        />
      ))}
    </Masonry>
  );
}