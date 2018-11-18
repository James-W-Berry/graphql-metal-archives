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

const getAnnouncements = async (res) => {
    let $ = cheerio.load(await res.text())
    return $('.motd')
}

const getAnnouncementTitle = async (announcement) => {
    let $ = cheerio.load(await announcement)
    return $('.titleLine').text().replace(/[\t\r]/g,"").replace(/[\n\n\n]/g, " ").replace("  Link  ", "").trim()
}

const getAnnouncementBody = async (announcementData) => {
    let $ = cheerio.load(await announcementData)
    return $('.body').text().replace(/[\t\r]/g,"").replace(/[\n]/g, " ").trim()
}

const getAnnouncementAuthor = async (announcementData) => {
    let $ = cheerio.load(await announcementData)
    return $('.profileMenu').first().text().replace(/[\t\r]/g,"").replace(/[\n]/g, " ").trim()
}