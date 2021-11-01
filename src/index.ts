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

// start the Express server
app.listen(port, (): void => {
    // tslint:disable-next-line: no-console
    console.log(`server started at http://localhost:${port}`)
})
