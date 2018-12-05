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

export const BandPageType = new GraphQLObjectType({
    name: 'BandPage',
    description: 'Band page',

    fields: () => ({
        Background: {
            type: new GraphQLList(BandBackgroundType),
            resolve: res => getBandBackground(res)
        }
    })
})

const BandBackgroundType = new GraphQLObjectType({
    name: 'BandBackground',
    description: 'Background information on the band',

    fields: () => ({
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

const getBandBackground = async (bandPageData) => {
    let $ = cheerio.load(await bandPageData.text())
    return $('#band_info')
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