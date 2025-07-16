#!/bin/bash
cd /home/kavia/workspace/code-generation/swift-movie-recommendations-4701/reactjs_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

