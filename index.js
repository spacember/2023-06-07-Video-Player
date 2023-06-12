const contentful = require("contentful-management");
const config = require('./config/config.json')
const contentType = require('./utils/extract.json')
const log = require("./utils/log");

const ACCESS_TOKEN = config.accessToken
const SPACEID = config.space.spaceId
const ENVIRONMENTID = config.space.environmentId
const LOCALE = config.space.locale
const CONTENT_TYPE = config.contentType

const BGIMG_ID = '6tklfWNrDr6SqkI1mElgfP'

const getEnvironment = async () => {
    try {
        const client = contentful.createClient({ accessToken: ACCESS_TOKEN })
        const space = await client.getSpace(SPACEID)
        return await space.getEnvironment(ENVIRONMENTID)
    } catch (err) {
        log(`Error occured on getEnvironment`)
    }
}

const createVideoPlayer = async (env, field) => {
    try {
        const entry = await env.createEntry(CONTENT_TYPE, { fields: field })
        await entry.publish()
        log(`Published entry videoPlayer: id: ${entry.sys.id}`)
    } catch (error) {
        log(`Error occured on createVideoPlayer`)
    }
}
 
const createVideoPlayers = async (env, entries) => {

    for (let index = 0; index < entries.length; index++) {

        const entry = entries[index]
        let field = entry.fields

        // adds a default background image
        if ('backgroundImage' in field) {
            field.backgroundImage[LOCALE].sys.id = BGIMG_ID
        }
        field = await createVideoPlayer(env, field)
    }
}

const updateAutoplay = async (env) => {

    try {
        const videoPlayer = await env.getEntries({ 'content_type': CONTENT_TYPE })
        const entries = videoPlayer.items

        for (let index = 0; index < entries.length; index++) {

            let entry = entries[index]
            const id = entry.sys.id
            let fields = entry.fields

            if (fields.backgroundImage == undefined) { 
                log(`Entry ${id} -skipped`)
                continue 
            }

            const oldEntry = await env.getEntry(id)

            fields.autoplay[LOCALE] = true
            oldEntry.fields = fields

            await oldEntry.update()

            // states
            if (oldEntry.isPublished()) {
                const entry = await env.getEntry(id)
                await entry.publish()
            }

            log(`Entry ${id} -passed`)
        }
    } catch (error) {
        log(`Error occured on updateAutoplayField`)
    }
}

const updateLocale = () => {
    return JSON.stringify(contentType).replaceAll('en-AE', 'en-US')
}

const getEntries = () => {
    const contentType = updateLocale()
    return JSON.parse(contentType).items
}

// main
(async () => {
    const env = await getEnvironment()
    const entries = getEntries()
    await createVideoPlayers(env, entries)
    await updateAutoplay(env)
})()