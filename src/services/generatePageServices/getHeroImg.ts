export const getHeroImg = async (
  heroImgquery: any,
  setHeroImg: React.Dispatch<React.SetStateAction<string>>,
  updatedb: any
) => {
  if (!heroImgquery) return;
  const response = await fetch(
    `https://api.unsplash.com/search/photos?query=${heroImgquery}&orientation=landscape&page=1&per_page=1&client_id=NnFxmV1FS3-YfreNX_sliS2dvLLstQ03RJDYimSEpyk`
  );
  const data1 = await response.json();
  if (data1?.results[0]?.urls?.full) setHeroImg(data1?.results[0]?.urls?.full);
  updatedb({
    hero_img: data1?.results[0]?.urls?.full,
  });
};
