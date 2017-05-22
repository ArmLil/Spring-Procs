'use  strict'

const sqlite3 = require( 'sqlite3' )
	.verbose();
const db = new sqlite3.Database( 'database.db' );

exports.get_db = async( last_arr ) => {
	return new Promise( ( resolve, reject ) => {

		db.serialize( () => {
			// Insert some data using a statement:
			let obj_arr = [];
			const statement = db.prepare( 'INSERT INTO `my_table` (`result`) VALUES (?)' );
			for ( let row = 0; row < last_arr.length; ++row ) {
				obj_arr.push( `
{ROW: ${row + 1}, USER: ${last_arr[row][0]}, PID: ${last_arr[row][1]}, COMMAND: ${last_arr[row][2]}}` );
			}
			statement.run( `${obj_arr}` );
			statement.finalize();

			const arr = [];
			db.each( "SELECT * FROM my_table", ( err, row ) => {
				if ( err ) reject( new Error( 'Opps' ) );
				//console.log(row);
				arr.push( row );
			} );
			resolve( arr );
			// Close the database:
			db.close();
		} );
	} );
};
