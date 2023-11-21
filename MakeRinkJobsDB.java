/*
* This program is executed once to create a RinkJobs database and its tables.
* Some test entries into the tables are inserted here as well.
*
* The program can be re-executed to reset the tables' entries.
* */

import java.sql.*;
import java.time.LocalDate;

public class MakeRinkJobsDB {

    static Statement statement;

    public static void main (String[] argv)
    {
        try {
            // The first step is to load the driver and use it to open
            // a connection to the H2 server (that should be running).
            Class.forName ("org.h2.Driver");
            Connection conn = DriverManager.getConnection (
                    "jdbc:h2:~/Desktop/myservers/databases/rinkjobs",
                    "sa",
                    ""
            );

            // If the connection worked, we'll reach here (otherwise an
            // exception is thrown.

            // Now make a statement, which is the object used to issue
            // queries.


            statement = conn.createStatement ();



            //String sql = "DELETE FROM USER WHERE LOGIN='test'";
            //statement.executeUpdate (sql);
            //The user table:
            makeUserTable ();
            printTable ("USER", 4);


            //The rink table:
            makeRinkTable ();
            printTable ("RINK", 3);

            // The current book table:
            makeApplicationTable ();
            printTable ("APPLICATION", 13);



            // Close the connection, and we're done.
            conn.close();
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }

    static void printTable (String tableName, int numColumns)
            throws SQLException
    {
        // Build the SELECT query string:
        String sql = "SELECT * FROM " + tableName;

        // Execute at the database, which returns rows that are
        // placed into the ResultSet object.
        ResultSet rs = statement.executeQuery (sql);

        // Now extract the results from ResultSet
        System.out.println ("\nRows from " + tableName + ":");
        while (rs.next()) {
            String row = "Row: ";
            for (int i=1; i<=numColumns; i++) {
                String s = rs.getString (i);
                // One could get an int column into an int variable.
                row += " " + s;
            }
            System.out.println (row);
        }
    }


    static void makeUserTable ()
            throws SQLException
    {
        // Get rid of any existing table by this name.
        String sql = "DROP TABLE IF EXISTS USER";
        statement.executeUpdate (sql);

        // Now make a fresh (but empty) table.
        sql = "CREATE TABLE USER (UID INT PRIMARY KEY, LOGIN VARCHAR(25), PASSWORD VARCHAR(12), ROLE VARCHAR(25))";
        statement.executeUpdate (sql);

        // Insert rows one by one.
        sql = "INSERT INTO USER VALUES (1, 'lucy', 'l123', 'manager')";
        statement.executeUpdate (sql);
        sql = "INSERT INTO USER VALUES (2, 'sophie', 's123', 'applicant')";
        statement.executeUpdate (sql);
        sql = "INSERT INTO USER VALUES (3, 'miguel', 'm123', 'applicant')";
        statement.executeUpdate (sql);
    }


    static void makeRinkTable ()
            throws SQLException
    {
        String sql = "DROP TABLE IF EXISTS RINK";
        statement.executeUpdate (sql);
        sql = "CREATE TABLE RINK (LOCATION VARCHAR(25) PRIMARY KEY, DESK_VACANCIES INT, ICE_VACANCIES INT)";
        statement.executeUpdate (sql);

        sql = "INSERT INTO RINK VALUES ('Bethesda', 5, 5)";
        statement.executeUpdate (sql);
        sql = "INSERT INTO RINK VALUES ('Gaithersburg', 5, 5)";
        statement.executeUpdate (sql);
        sql = "INSERT INTO RINK VALUES ('Rockville', 5, 5)";
        statement.executeUpdate (sql);
        sql = "INSERT INTO RINK VALUES ('Silver Spring', 5, 5)";
        statement.executeUpdate (sql);
    }


    static void makeApplicationTable ()
            throws SQLException
    {
        String sql = "DROP TABLE IF EXISTS APPLICATION";
        statement.executeUpdate (sql);

        sql = "CREATE TABLE APPLICATION " +
                "(" +
                "UID INT PRIMARY KEY, " +
                "FIRSTNAME VARCHAR(25), " +
                "LASTNAME VARCHAR(25), " +
                "AGE INT, " +
                "EMAIL VARCHAR(50), " +
                "LOCATIONPREFERENCE VARCHAR(25), " +
                "JOBPREFERENCE VARCHAR(25), " +
                "SKATINGSKILL INT, " +
                "APPLICATIONDATE DATE, " +
                "STATUS VARCHAR(25), " +
                "LOCATIONASSIGNMENT VARCHAR(25), " +
                "JOBASSIGNMENT VARCHAR(25), " +
                "REVIEWDATE DATE" +
                ")";
        statement.executeUpdate (sql);

        String currentDate = String.valueOf(java.time.LocalDate.now());
        sql = "INSERT INTO APPLICATION VALUES " +
                "(" +
                    "2, " +
                    "'Sophie', " +
                    "'Lurie', " +
                    "16, " +
                    "'slurie@mcc.edu', " +
                    "'Rockville', " +
                    "'ice', " +
                    "85, " +
                    "'" + currentDate + "', " +
                    "'under_review', " +
                    "NULL, " +
                    "NULL, " +
                    "NULL" +
                ")";
        statement.executeUpdate (sql);

        sql = "INSERT INTO APPLICATION VALUES " +
                "(" +
                "3, " +
                "'Miguel', " +
                "'Alvarez', " +
                "20, " +
                "'alvarez2020@gmail.com', " +
                "'Gaithersburg', " +
                "'desk', " +
                "60, " +
                "'" + currentDate + "', " +
                "'under_review', " +
                "NULL, " +
                "NULL, " +
                "NULL" +
                ")";
        statement.executeUpdate (sql);

    }

}