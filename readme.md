# cloudindex

A GitHub webhook endpoint to generate AWS CloudSearch index updates from a Jekyll site.

## Application Flow

- receive webhook post
- get added, modified, and deleted _posts/* files
- parse yml and content
    - interpret published flag
    - format JSON object with SDF fields
        - use url.replace('/', '_') for id [1]
        - use last commit's timestamp for version
- output SDF files
- batch SDF files in groups < 5mb
- push SDF files to CS


[1] url formulation

1. permalink, if specified
2. read _config.yml for permalink structure
    - use default
    - parse the filename (title, year, month, date, remove leading zeroes), category / categories attribute