import { extract } from '@extractus/article-extractor'

export const getArticle = async () => {
  const input = 'https://www.cnbc.com/2022/09/21/what-another-major-rate-hike-by-the-federal-reserve-means-to-you.html'

  // here we use top-level await, assume current platform supports it
  try {
    const article = await extract(input)
    console.log(article)
  } catch (err) {
    console.error(err)
  }
}

// module.exports = { getArticle }
