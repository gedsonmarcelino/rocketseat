import { useEffect, useState } from 'react';
import { GenreResponseProps } from '../App';
import { Button } from '../components/Button';

// interface GenreResponseProps {
//   id: number;
//   name: 'action' | 'comedy' | 'documentary' | 'drama' | 'horror' | 'family';
//   title: string;
// }

// interface MovieProps {
//   imdbID: string;
//   Title: string;
//   Poster: string;
//   Ratings: Array<{
//     Source: string;
//     Value: string;
//   }>;
//   Runtime: string;
// }

type SideBarProps = {
  genres: GenreResponseProps[],
  onClick: (id: number) => void,
  selectedGenreId: number
}

export function SideBar({ genres, onClick, selectedGenreId }: SideBarProps) {
  return (
    <nav className="sidebar">
      <span>Watch<p>Me</p></span>

      <div className="buttons-container">
        {genres.map(genre => (
          <Button
            key={String(genre.id)}
            title={genre.title}
            iconName={genre.name}
            onClick={() => onClick(genre.id)}
            selected={selectedGenreId === genre.id}
          />
        ))}
      </div>

    </nav>
  )
}