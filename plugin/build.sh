#cd plugin/ && zip -r dev.zip dev/
cd plugin/ && sudo rm /var/www/html/wp-content/plugins/dev/* && sudo cp dev/* /var/www/html/wp-content/plugins/dev/