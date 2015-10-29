#!/usr/bin/env python
# Name: Pim van Alphen
# Student number: 11082887
'''
This script scrapes IMDB and outputs a CSV file with highest ranking tv series.
'''
# IF YOU WANT TO TEST YOUR ATTEMPT, RUN THE test-tvscraper.py SCRIPT.
import csv
import csv, codecs, cStringIO

from pattern.web import URL, DOM

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):
    '''
    Extract a list of highest ranking TV series from DOM (of IMDB page).

    Each TV series entry should contain the following fields:
    - TV Title
    - Ranking
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    '''

    # ADD YOUR CODE HERE TO EXTRACT THE ABOVE INFORMATION ABOUT THE
    # HIGHEST RANKING TV-SERIES
    # NOTE: FOR THIS EXERCISE YOU ARE ALLOWED (BUT NOT REQUIRED) TO IGNORE
    # UNICODE CHARACTERS AND SIMPLY LEAVE THEM OUT OF THE OUTPUT.
    extractedTvseries = []
    for a in dom.by_tag("table.results"):
        for b in a.by_tag("tr")[1:]:
            for c in b.by_tag("td.title"):

                tvserie = []

                for d in c.by_tag("a"):
                    tvserie.append(d.content)
                    break

                for d in c.by_tag("div.rating rating-list"):
                    tmpRating = d.attrs["id"]
                    tmpRating = tmpRating.split("|")
                    tvserie.append(tmpRating[2])
                    break

                for d in c.by_tag("span.genre"):
                    tmpGenres = ''
                    for e in d.by_tag("a"):
                        tmpGenre = e.content
                        if tmpGenres != '':
                            tmpGenres += ","
                        tmpGenres += tmpGenre
                    tvserie.append(tmpGenres)

                for d in c.by_tag("span.credit"):
                    tmpCredits = ''
                    for e in d.by_tag("a"):
                        tmpCredit = e.content
                        if tmpCredits != '':
                            tmpCredits += ","
                        tmpCredits += tmpCredit
                    tvserie.append(tmpCredits)

                for d in c.by_tag("span.runtime"):
                    tmpRuntime = d.content
                    tmpRuntime = tmpRuntime.split()
                    tvserie.append(tmpRuntime[0])
                    break
                else:
                    tvserie.append(0)

                extractedTvseries.append(tvserie)

    return extractedTvseries

# Unicodewriter is taken from pythons online documentation, see https://docs.python.org/2/library/csv.html
class UnicodeWriter:
    """
    A CSV writer which will write rows to CSV file "f",
    which is encoded in the given encoding.
    """

    def __init__(self, f, dialect=csv.excel, encoding="utf-8", **kwds):
        # Redirect output to a queue
        self.queue = cStringIO.StringIO()
        self.writer = csv.writer(self.queue, dialect=dialect, **kwds)
        self.stream = f
        self.encoder = codecs.getincrementalencoder(encoding)()

    def writerow(self, row):
        self.writer.writerow([s.encode("utf-8") for s in row])
        # Fetch UTF-8 output from the queue ...
        data = self.queue.getvalue()
        data = data.decode("utf-8")
        # ... and reencode it into the target encoding
        data = self.encoder.encode(data)
        # write to the target stream
        self.stream.write(data)
        # empty queue
        self.queue.truncate(0)

    def writerows(self, rows):
        for row in rows:
            self.writerow(row)

def save_csv(f, tvseries):
    '''
    Output a CSV file containing highest ranking TV-series.
    '''
    writer = UnicodeWriter(f)
    writer.writerow(['Title', 'Ranking', 'Genre', 'Actors', 'Runtime'])
    for lists in tvseries:
        writer.writerow([lists[0],lists[1],lists[2],lists[3],lists[4]])

    # ADD SOME CODE OF YOURSELF HERE TO WRITE THE TV-SERIES TO DISK

if __name__ == '__main__':
    # Download the HTML file
    url = URL(TARGET_URL)
    html = url.download()

    # Save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in testing / grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # Parse the HTML file into a DOM representation
    dom = DOM(html)

    # Extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # Write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'wb') as output_file:
        save_csv(output_file, tvseries)
