const cheerio = require('cheerio')
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
    let $ = cheerio.load(await homePageData.text())
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
    let $ = cheerio.load(await homePageData.text())
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