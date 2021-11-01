import e, {Application, Request, Response} from 'express'
// tslint:disable-next-line: no-require-imports
import path from 'path'

const app: Application = e()
const port: number = 8080 // default port to listen

app.set( 'views', path.join( __dirname, 'views' ) )
app.set( 'view engine', 'ejs' )

// define a route handler for the default home page
app.get(`/`, (_: Request, res: Response): void => {
    res.render( 'index' )
})

app.get(`/style/style.css`, (_: Request, res: Response): void => {
    const html: string = path.join( __dirname, 'views', 'style', 'style.css' )
    res.sendFile(html)
})

app.get(`/scripts/watch.js`, (_: Request, res: Response): void => {
    const html: string = path.join( __dirname, 'views', 'scripts', 'watch.js' )
    res.sendFile(html)
})

// start the Express server
app.listen(port, (): void => {
    // tslint:disable-next-line: no-console
    console.log(`server started at http://localhost:${port}`)
})
