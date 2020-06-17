#!/bin/bash

echo "Starting the build creation process."
echo "";

CLOSE_APP_ARR=( chrome code )
ENVIRONMENT_ARR=( production )
ANGULAR_BASE_DIR="infibeam"
BUILD_ENVIRONMENT=1
BUILD_NAME=""

show_error()
{
   error=$1;
   echo "ERROR: $error";
   echo;
   exit 1;
}

check_directory()
{
  curr_directory=${PWD##*/};
  if [ $curr_directory != $ANGULAR_BASE_DIR ]
  then
    show_error "You are running script in wrong directory."
  fi
}

close_chrome_vscode()
{
  echo -n "Should I close chrome and vscode editor(Y/N) ? "; read close_chrome_code_decision

  if [ $close_chrome_code_decision == "Y" ] || [ $close_chrome_code_decision == "y" ]
  then
      for i in ${CLOSE_APP_ARR[@]}
      do
        killall -9 $i
      done
  fi
}

choose_environment()
{
  echo "";
  echo "Choose environment number";
  echo "1. PRODUCTION";

  _env=2
  while [ "$_env" -gt 1 ]
  do
    echo -n "Please choose target environment ? "; read _env;
    if [ "$_env" -gt 1 ]
    then
      echo "ERROR: Incorrect input. Try again."
    fi
    BUILD_ENVIRONMENT=${ENVIRONMENT_ARR[$_env-1]};
  done
  echo "";
}

create_build()
{
  echo "";
  echo "Build creation process start."
  node "node_modules/@angular/cli/bin/ng" build --prod --configuration=${BUILD_ENVIRONMENT};
  echo "";
}

#Check we are in right directory
check_directory

#Close chrome and vscode editor
close_chrome_vscode

#choose environment
choose_environment

#create build
create_build

cmd /k
