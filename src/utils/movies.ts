// const movies = [
//   {
//     title: "Big Buck Bunny",
//     description:
//       "A large and gentle rabbit takes a stand against bullying in this animated short film.",
//     videoUrl:
//       "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
//     thumbnailUrl:
//       "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
//     genre: "Animation",
//     duration: "10 min",
//     rating: 6.4,
//     mood: "Light-hearted, playful, uplifting",
//   },
//   {
//     title: "Sintel",
//     description:
//       "A young girl embarks on a quest to find her pet dragon in this action-packed fantasy tale.",
//     videoUrl:
//       "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
//     thumbnailUrl:
//       "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg",
//     genre: "Fantasy",
//     duration: "14 min",
//     rating: 7.4,
//     mood: "Adventurous, emotional, bittersweet",
//   },
//   {
//     title: "Tears of Steel",
//     description:
//       "A group of warriors and scientists gather in Amsterdam to stage a crucial event from the past.",
//     videoUrl:
//       "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
//     thumbnailUrl:
//       "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg",
//     genre: "Sci-Fi",
//     duration: "12 min",
//     rating: 5.5,
//     mood: "Intense, dramatic, futuristic",
//   },
//   {
//     title: "Elephant's Dream",
//     description:
//       "The surreal story of two men exploring the strange and abstract world inside a machine.",
//     videoUrl:
//       "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
//     thumbnailUrl:
//       "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
//     genre: "Experimental",
//     duration: "10 min",
//     rating: 5.6,
//     mood: "Surreal, mysterious, introspective",
//   },
//   {
//     title: "For Bigger Blazes",
//     description:
//       "A dramatic fire scene designed to demonstrate the capabilities of high-resolution video.",
//     videoUrl:
//       "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
//     thumbnailUrl:
//       "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg",
//     genre: "Action",
//     duration: "1 min",
//     rating: 6.6,
//     mood: "Exciting, energetic, dramatic",
//   },
// ];

// const recommendationTestOutput = {
//   recommendation: [
//     {
//       title: "Sintel",
//       description:
//         "A young girl embarks on a quest to find her pet dragon in this action-packed fantasy tale.",
//       videoUrl: "https://commv12 min",
//       thumbnailUrl:
//         "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg",
//       genre: "Fantasy",
//       duration: "14 min",
//       rating: 7.4,
//       _id: "1",
//       mood: "",
//     },
//     {
//       title: "Big Buck Bunny",
//       description:
//         "A large and gentle rabbit takes a stand against bullying in this animated short film.",
//       videoUrl:
//         "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
//       thumbnailUrl:
//         "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
//       genre: "Animation",
//       duration: "10 min",
//       rating: 6.4,
//       _id: "1",
//       mood: "",
//     },
//     {
//       title: "For Bigger Blazes",
//       description:
//         "A dramatic fire scene designed to demonstrate the capabilities of high-resolution video.",
//       videoUrl:
//         "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
//       thumbnailUrl:
//         "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg",
//       genre: "Action",
//       duration: "1 min",
//       rating: 6.6,
//       _id: "1",
//       mood: "",
//     },
//   ],
//   reason:
//     "Based on your preferences, I've recommended 'Sintel', 'Big Buck Bunny', and 'For Bigger Blazes'. 'Sintel' is a highly-rated fantasy film that aligns with your 'adventurous' and 'emotional' mood preferences. 'Big Buck Bunny' fits your 'Animation' genre preference and 'playful', 'light-hearted' mood. 'For Bigger Blazes' matches your 'Action' genre preference and 'intense', 'dramatic' mood. I've excluded 'Tears of Steel' and 'Elephant's Dream' as they don't strongly align with your 'adventurous', 'emotional', or 'futuristic' mood preferences. Please note that your minimum rating preference of 12 is not met by any of the movies, and your minimum duration preference of 4 minutes excludes 'For Bigger Blazes' from being a perfect match.",
// };

// export { recommendationTestOutput };
const movies = [
  {
    title: "Big Buck Bunny",
    description:
      "A large and gentle rabbit takes a stand against bullying in this animated short film.",
    videoUrl:
      "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnailUrl:
      "https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217",
    genre: "Animation",
    duration: "10 min",
    rating: 6.4,
    mood: "Light-hearted, playful, uplifting",
  },
  {
    title: "Sintel",
    description:
      "A young girl embarks on a quest to find her pet dragon in this action-packed fantasy tale.",
    videoUrl:
      "https://media.w3.org/2010/05/sintel/trailer.mp4",
    thumbnailUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Sintel_poster.jpg/800px-Sintel_poster.jpg",
    genre: "Fantasy",
    duration: "14 min",
    rating: 7.4,
    mood: "Adventurous, emotional, bittersweet",
  },
  {
    title: "Tears of Steel",
    description:
      "A group of warriors and scientists gather in Amsterdam to stage a crucial event from the past.",
    videoUrl:
      "https://archive.org/download/TearsOfSteel1080p/TearsOfSteel_4000.mp4",
    thumbnailUrl:
      "https://mango.blender.org/wp-content/uploads/2013/05/01_thom_celia_bridge.jpg",
    genre: "Sci-Fi",
    duration: "12 min",
    rating: 5.5,
    mood: "Intense, dramatic, futuristic",
  },
  {
    title: "Elephant's Dream",
    description:
      "The surreal story of two men exploring the strange and abstract world inside a machine.",
    videoUrl:
      "https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4",
    thumbnailUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Elephants_Dream_s1_proog.jpg/800px-Elephants_Dream_s1_proog.jpg",
    genre: "Experimental",
    duration: "10 min",
    rating: 5.6,
    mood: "Surreal, mysterious, introspective",
  },
  {
    title: "For Bigger Blazes",
    description:
      "A dramatic fire scene designed to demonstrate the capabilities of high-resolution video.",
    videoUrl:
      "https://www.w3schools.com/html/movie.mp4",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba",
    genre: "Action",
    duration: "1 min",
    rating: 6.6,
    mood: "Exciting, energetic, dramatic",
  },
];

const recommendationTestOutput = {
  recommendation: [
    {
      title: "Sintel",
      description:
        "A young girl embarks on a quest to find her pet dragon in this action-packed fantasy tale.",
      videoUrl:
        "https://media.w3.org/2010/05/sintel/trailer.mp4",
      thumbnailUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Sintel_poster.jpg/800px-Sintel_poster.jpg",
      genre: "Fantasy",
      duration: "14 min",
      rating: 7.4,
      _id: "1",
      mood: "",
    },
    {
      title: "Big Buck Bunny",
      description:
        "A large and gentle rabbit takes a stand against bullying in this animated short film.",
      videoUrl:
        "https://www.w3schools.com/html/mov_bbb.mp4",
      thumbnailUrl:
        "https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217",
      genre: "Animation",
      duration: "10 min",
      rating: 6.4,
      _id: "1",
      mood: "",
    },
    {
      title: "For Bigger Blazes",
      description:
        "A dramatic fire scene designed to demonstrate the capabilities of high-resolution video.",
      videoUrl:
        "https://www.w3schools.com/html/movie.mp4",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1519681393784-d120267933ba",
      genre: "Action",
      duration: "1 min",
      rating: 6.6,
      _id: "1",
      mood: "",
    },
  ],
  reason:
    "Based on your preferences, I've recommended 'Sintel', 'Big Buck Bunny', and 'For Bigger Blazes'. 'Sintel' is a highly-rated fantasy film that aligns with your 'adventurous' and 'emotional' mood preferences. 'Big Buck Bunny' fits your 'Animation' genre preference and 'playful', 'light-hearted' mood. 'For Bigger Blazes' matches your 'Action' genre preference and 'intense', 'dramatic' mood.",
};

export { recommendationTestOutput };