"use strict";
// import { useState } from "react";
// import SearchModal from "./SearchSong";
// const Playlist = () => {
//   const [isLike, setIsLike] = useState(false);
//   // Format the song duration into a readable time format
//   const formatDuration = (seconds: number): string => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
//   };
//   // const handleLikes = {
//   //   setIsLike(true);
//   // }
//   return (
//     <div className="playlist">
//       <table>
//         <thead>
//           <tr>
//             <th>Track</th>
//             <th>Artist</th>
//             <th>Time</th>
//             <th>Album</th>
//             <th>Likes</th>
//           </tr>
//         </thead>
//         <tbody>
//           {/* {"".map((song) => ( */}
//             <tr key={song.id}>
//               <td>{song.title}</td>
//               <td>{song.artist.name}</td>
//               <td>{formatDuration(song.duration)}</td>
//               <td>{song.album.title}</td>
//               <td><i className="fa-regular fa-thumbs-up"></i></td>
//             </tr>
//           {/* ))} */}
//         </tbody>
//       </table>
//     </div>
//   )
// };
// export default Playlist;
