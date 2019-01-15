const cheerio = require('cheerio')
const fetch = require('node-fetch')

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList
} from 'graphql';


export const HomePageType = new GraphQLObjectType({
    name: 'HomePage',
    description: 'Base object representing Metal Archives landing page',

    fields: () => ({
        Announcements: {
            type: new GraphQLList(AnnouncementType),
            resolve: res => getAnnouncements(res)    
        },
        UpcomingAlbums: {
            type: new GraphQLList(UpcomingAlbumsType),
            resolve: res => getUpcomingAlbums(res)
        }
    })
})

export const BandPageType = new GraphQLObjectType({
    name: 'BandPage',
    description: 'Band page',

    fields: () => ({
        Background: {
            type: new GraphQLList(BandBackgroundType),
            resolve: res => getBandBackground(res)
        },
        Comment: {
            type: new GraphQLList(BandCommentType),
            resolve: res => getBandComment(res)
        },
        Discography: {
            type: new GraphQLList(BandDiscographyType),
            resolve: res => getBandDiscography(res)
        },
        Members: {
            type: new GraphQLList(BandMembersType),
            resolve: res => getBandMembers(res)
        }
    })
})

export const ReviewPageType = new GraphQLObjectType({
    name: 'ReviewPage',
    description: 'Discography Review',

    fields: () => ({
        Reviews: {
            type: new GraphQLList(ReviewType),
            resolve: res => getDiscographyReviews(res)
        }
    })
})

const ReviewType = new GraphQLObjectType({
    name: 'Review',
    description: 'Discography item reviews',

    fields: () => ({
        title: {
            type: GraphQLString,
            resolve: reviews => getReviewTitle(reviews)
        },
        author: {
            type: GraphQLString,
            resolve: reviews => getReviewAuthor(reviews)
        },
        date: {
            type: GraphQLString,
            resolve: reviews => getReviewDate(reviews)
        },
        reviewBody: {
            type: GraphQLString,
            resolve: reviews => getReviewBody(reviews)
        }
    })
})

const BandMembersType = new GraphQLObjectType({
    name: 'BandMembers',
    description: 'band members',

    fields: () => ({
        current: {
            type: new GraphQLList(MemberType),
            resolve: bandMembers => getCurrentMembers(bandMembers)
        },
        past: {
            type: new GraphQLList(MemberType),
            resolve: bandMembers => getPastMembers(bandMembers)
        },
        live: {
            type: new GraphQLList(MemberType),
            resolve: bandMembers => getLiveMembers(bandMembers)
        }
    })
})

const MemberType = new GraphQLObjectType({
    name: 'BandMember',
    description: 'band member',

    fields: () => ({
        name: {
            type: GraphQLString,
            resolve: member => getMemberName(member)
        },
        instruments: {
            type: GraphQLString,
            resolve: member => getMemberInstruments(member)
        }
    })
})

const BandDiscographyType = new GraphQLObjectType({
    name: 'BandDiscography',
    description: 'complete discography for the band',

    fields: () => ({
        name: {
            type: GraphQLString,
            resolve: bandDiscography => getDiscographyName(bandDiscography)
        },
        type: {
            type: GraphQLString,
            resolve: bandDiscography => getDiscographyType(bandDiscography)
        },
        year: {
            type: GraphQLString,
            resolve: bandDiscography => getDiscographyYear(bandDiscography)
        },
        score: {
            type: GraphQLString,
            resolve: bandDiscography => getDiscographyScore(bandDiscography)
        },
        reviewLink: {
            type: GraphQLString,
            resolve: bandDiscography => getDiscographyReviewLink(bandDiscography)
        }
    })
})

const BandCommentType = new GraphQLObjectType({
    name: 'BandComment',
    description: 'Comment on the band',

    fields: () => ({
        comment: {
            type: GraphQLString,
            resolve: bandComment => getComment(bandComment)
        },
        expandLink: {
            type: GraphQLString,
            resolve: bandComment => getExpandLink(bandComment)
        }
    })
})

const BandBackgroundType = new GraphQLObjectType({
    name: 'BandBackground',
    description: 'Background information on the band',

    fields: () => ({
        id: {
            type: GraphQLString,
            resolve: bandInfo => getId(bandInfo)
        },
        name: {
            type: GraphQLString,
            resolve: bandInfo => getName(bandInfo)
        },
        country: {
            type: GraphQLString,
            resolve: bandInfo => getCountry(bandInfo)
        },
        location: {
            type: GraphQLString,
            resolve: bandInfo => getLocation(bandInfo)
        },
        status: {
            type: GraphQLString,
            resolve: bandInfo => getStatus(bandInfo)
        },
        yearFormed: {
            type: GraphQLString,
            resolve: bandInfo => getYearFormed(bandInfo)
        },
        genre: {
            type: GraphQLString,
            resolve: bandInfo => getGenre(bandInfo)
        },
        lyricalThemes: {
            type: GraphQLString,
            resolve: bandInfo => getLyricalThemes(bandInfo)
        },
        label: {
            type: GraphQLString,
            resolve: bandInfo => getLabel(bandInfo)
        },
        yearsActive: {
            type: GraphQLString,
            resolve: bandInfo => getYearsActive(bandInfo)
        }
    })
})

const UpcomingAlbumsType = new GraphQLObjectType({
    name: 'UpcomingAlbums',
    description: 'Upcoming albums to be released',

    fields: () => ({
        band: {
            type: GraphQLString,
            resolve: upcomingAlbums => getUpcomingAlbumBand(upcomingAlbums)
        },
        album: {
            type: GraphQLString,
            resolve: upcomingAlbums => getUpcomingAlbumName(upcomingAlbums)
        },
        releaseDate: {
            type: GraphQLString,
            resolve: upcomingAlbums => getUpcomingAlbumReleaseDate(upcomingAlbums)
        }
    })
})

const AnnouncementType = new GraphQLObjectType({
    name: 'Announcement',
    description: 'Home page announcements',

    fields: () => ({
        title: {
            type: GraphQLString,
            resolve: announcements => getAnnouncementTitle(announcements) 
        },
        body: {
            type: GraphQLString,
            resolve: announcements => getAnnouncementBody(announcements)
        },
        author: {
            type: GraphQLString,
            resolve: announcements => getAnnouncementAuthor(announcements)
        }
    })
})

const getAnnouncements = async (homePageData) => {
    let data = homePageData.clone();
    let $ = cheerio.load(await data.text())
    return $('.motd')
}

const getAnnouncementTitle = async (announcementData) => {
    let $ = cheerio.load(await announcementData)
    return $('.titleLine').text().replace(/[\t\r]/g,"").replace(/[\n\n\n]/g, " ").replace("  Link  ", "").trim()
}

const getAnnouncementBody = async (announcementData) => {
    let $ = cheerio.load(await announcementData)
    return $('.body').text().replace(/[\t\r]/g,"").replace(/[\n]/g, " ").trim()
}

const getAnnouncementAuthor = async (announcementData) => {
    let $ = cheerio.load(await announcementData)
    return $('.profileMenu').text().replace(/[\t\r]/g,"").replace(/[\n]/g, " ").trim()
}

const getUpcomingAlbums = async (homePageData) => {
    let data = homePageData.clone();
    let $ = cheerio.load(await data.text())
    return $('#upcomingAlbums .ui-tabs-panel-content tr')
}

const getUpcomingAlbumBand = async (upcomingAlbumsData) => {
    let $ = cheerio.load(await upcomingAlbumsData)
    return $('tr').children('td').eq(0).text()
}

const getUpcomingAlbumName = async (upcomingAlbumsData) => {
    let $ = cheerio.load(await upcomingAlbumsData)
    return $('tr').children('td').eq(1).text()
}

const getUpcomingAlbumReleaseDate = async (upcomingAlbumsData) => {
    let $ = cheerio.load(await upcomingAlbumsData)
    return $('tr').children('td').eq(2).text()
}

const getBandBackground = async (bandPageData) => {
    let data = bandPageData.clone();
    let $ = cheerio.load(await data.text())
    return $('#band_info')
}

const getId = async (bandBackgroundData) => {
    let $ = cheerio.load(await bandBackgroundData)
    return $('#band_info .band_name').children('a').attr('href')
}

const getName = async (bandBackgroundData) => {
    let $ = cheerio.load(await bandBackgroundData)
    return $('#band_info .band_name').children('a').eq(0).text()
}

const getCountry = async (bandBackgroundData) => {
    let $ = cheerio.load(await bandBackgroundData)
    return $('#band_stats .float_left').children('dd').eq(0).text()
}

const getLocation = async (bandBackgroundData) => {
    let $ = cheerio.load(await bandBackgroundData)
    return $('#band_stats .float_left').children('dd').eq(1).text()
}

const getStatus = async (bandBackgroundData) => {
    let $ = cheerio.load(await bandBackgroundData)
    return $('#band_stats .float_left').children('dd').eq(2).text()
}

const getYearFormed = async (bandBackgroundData) => {
    let $ = cheerio.load(await bandBackgroundData)
    return $('#band_stats .float_left').children('dd').eq(3).text()
}

const getGenre = async (bandBackgroundData) => {
    let $ = cheerio.load(await bandBackgroundData)
    return $('#band_stats .float_right').children('dd').eq(0).text()
}

const getLyricalThemes = async (bandBackgroundData) => {
    let $ = cheerio.load(await bandBackgroundData)
    return $('#band_stats .float_right').children('dd').eq(1).text()
}

const getLabel = async (bandBackgroundData) => {
    let $ = cheerio.load(await bandBackgroundData)
    return $('#band_stats .float_right').children('dd').eq(2).text()
}

const getYearsActive = async (bandBackgroundData) => {
    let $ = cheerio.load(await bandBackgroundData)
    return $('#band_stats .clear').children('dd').eq(0).text().replace(/[\t\r\n]/g,"").replace(/ +(?= )/g,'').trim()
}

const getBandComment = async (bandPageData) => {
    let data = bandPageData.clone();
    let $ = cheerio.load(await data.text())
    return $('.band_comment.clear')
}

const getComment = async (bandCommentData) => {
     let $ = cheerio.load(await bandCommentData)
     return $('.band_comment').text().replace(/[\t\r\n]/g,"").replace(/[\"]/g,"").trim()
}

const getExpandLink = async (bandCommentData) => {
    //TODO: resolve expanded comment 
    let $ = cheerio.load(await bandCommentData)
    //return $('.tool_strip.bottom.right').children('a').text().trim()
    return "expanded comment"
}

const getBandDiscography = async (bandPageData) => {
    let data = bandPageData.clone();
    let $ = cheerio.load(await data.text())
    const band_id = $('#band_info h1 a').attr('href').split("/")[5]
    const discographyPageData = await fetch(`https://www.metal-archives.com/band/discography/id/${band_id}/tab/all`)
    let discogSelector = cheerio.load(await discographyPageData.text())
    return discogSelector('.display.discog tbody tr');
}

const getDiscographyName = async (bandDiscographyData) => {
    let $ = cheerio.load(await bandDiscographyData)
    return $('tr').children('td').eq(0).text().replace(/[\t\r\n]/g,"").replace(/[\"]/g,"").trim()
}

const getDiscographyType = async (bandDiscographyData) => {
    let $ = cheerio.load(await bandDiscographyData)
    return $('tr').children('td').eq(1).text().replace(/[\t\r\n]/g,"").replace(/[\"]/g,"").trim()
}

const getDiscographyYear = async (bandDiscographyData) => {
    let $ = cheerio.load(await bandDiscographyData)
    return $('tr').children('td').eq(2).text().replace(/[\t\r\n]/g,"").replace(/[\"]/g,"").trim()
}

const getDiscographyScore = async (bandDiscographyData) => {
    let $ = cheerio.load(await bandDiscographyData)
    let review = $('tr').children('td').eq(3).text().replace(/[\t\r\n]/g,"").replace(/[\"]/g,"").trim()

    if (review !== "") { 
        let score = review.split(" ")[1].replace("(", "").replace(")", "")
        let reviewers =  review.split(" ")[0]
        if(reviewers === "1") {
            return (`${score} - ${reviewers} review`)
        } else {
            return (`${score} - ${reviewers} reviews`)
        }
    } else {
        return review
    }    
}

const getDiscographyReviewLink = async (bandDiscographyData) => {
    let $ = cheerio.load(await bandDiscographyData)
    let reviewLink = $('tr').children('td').eq(3).children('a').attr('href')

    if (reviewLink !== undefined) { return reviewLink }
    else { return "" }
}

const getDiscographyReviews = async (reviewPageData) => {
    let data = reviewPageData.clone();
    let $ = cheerio.load(await data.text())
    return $('.reviewBox');
}

const getReviewTitle = async (reviewData) => {
    let $ = cheerio.load(await reviewData)
    return $('.reviewTitle').text().replace(/[\t\r\n]/g,"").replace(/[\"]/g,"").trim()
}

const getReviewAuthor = async (reviewData) => {
    let $ = cheerio.load(await reviewData)
    return $('.profileMenu').text().replace(/[\t\r\n]/g,"").replace(/[\"]/g,"").trim()
}

const getReviewDate = async (reviewData) => {
    let $ = cheerio.load(await reviewData)
    const dateRow = $('.reviewBox').children('div').eq(1).text().replace(/[\t\r\n]/g,"").replace(/[\"]/g,"").trim()
    const date = dateRow.split(", ");
    return (`${date[1]}, ${date[2]}`)
}

const getReviewBody = async (reviewData) => {
    let $ = cheerio.load(await reviewData)
    return $('.reviewContent').text().replace(/[\t\r\n]/g,"").replace(/[\"]/g,"").trim()
}

const getBandMembers = async (bandPageData) => {
    let data = bandPageData.clone();
    let $ = cheerio.load(await data.text())
    return $('#band_members')
}

const getCurrentMembers = async (memberData) => {
    let $ = cheerio.load(await memberData)
    return $('#band_tab_members_current tr.lineupRow')
}

const getPastMembers = async (memberData) => {
    let $ = cheerio.load(await memberData)
    return $('#band_tab_members_past tr.lineupRow')
}

const getLiveMembers = async (memberData) => {
    let $ = cheerio.load(await memberData)
    return $('#band_tab_members_live tr.lineupRow')
}

const getMemberName = async (member) => {
    let $ = cheerio.load(await member)
    return $('tr').children('td').eq(0).text().replace(/[\t\r\n]/g,"").replace(/[\"]/g,"").trim()
}

const getMemberInstruments = async (member) => {
    let $ = cheerio.load(await member)
    return $('tr').children('td').eq(1).text().replace(/[\t\r\n]/g,"").replace(/[\"]/g,"").trim()
}
