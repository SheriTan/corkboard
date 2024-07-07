// Node 20.0 follows SDK 3
// Find threads followed by user (returns original thread)
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, BatchGetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: process.env.region });
const ddbDocClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    const userId = event.queryStringParameters['userid'] || '';
    
    // Step 1: Retrieve the list of followed threads
    const followParams = {
        TableName: process.env.tableName, // replace with your table name
        KeyConditionExpression: 'PK = :pk and begins_with(SK, :sk)',
        ExpressionAttributeValues: {
            ':pk': `USER#${userId}`,
            ':sk': 'FOLLOW#'
        }
    };
    
    try {
        // Retrieve followed thread items
        const followData = await ddbDocClient.send(new QueryCommand(followParams));

        // Extract threadIds from followData
        const threadIds = followData.Items.map(item => item.thread);
        let resThreads = [];
        
        // Step 2: Use BatchGetCommand to fetch details of all threads
        const batchGetParams = {
            RequestItems: {
                [process.env.tableName]: {
                    Keys: threadIds.map(threadId => ({
                        PK: `THREAD#${threadId}`,
                        SK: `THREAD#${threadId}`
                    }))
                }
            }
        };
        
        // Batch get details of all threads
        const batchGetData = await ddbDocClient.send(new BatchGetCommand(batchGetParams));
        
        resThreads = batchGetData.Responses[process.env.tableName];
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                threads: resThreads
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                error: error.message
            })
        };
    }
}

// Node 20.0 follows SDK 3
// Find all threads in descending order (global)
// Create GSI with PK as comment and SK as SK
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const client2 = new DynamoDBClient({ region: process.env.region });
const ddbDocClient2 = DynamoDBDocumentClient.from(client2);

export const handler2 = async () => {
const params = {
        TableName: process.env.tableName,
        IndexName: 'global-index',
        KeyConditionExpression: '#comment = :cid and begins_with(SK, :sk)',
        ExpressionAttributeNames: {
            '#comment': 'comment' // Use an alias for the reserved keyword
        },
        ExpressionAttributeValues: {
            ':cid': 'NA',
            ':sk': 'THREAD#'
        },
        ScanIndexForward: false // false to get results in descending order (newest first)
    };

    try {
        const data = await ddbDocClient2.send(new QueryCommand(params));
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(data.Items)
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ error: 'Could not fetch threads', details: error.message })
        };
    }
};

// Node 20.0 follows SDK 3
// Find all comments and original thread in descending order
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const client3 = new DynamoDBClient({ region: process.env.region });
const ddbDocClient3 = DynamoDBDocumentClient.from(client3);

export const handler3 = async (event) => {
  const threadId = event.queryStringParameters['thread'] || '';
  
  const commentParams = {
    TableName: process.env.tableName,
    KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
    ExpressionAttributeValues: {
      ':pk': `THREAD#${threadId}`,
      ':sk': 'COMMENT#'
    },
    ScanIndexForward: false // false to get results in descending order (newest first)
  };

  const threadParams = {
    TableName: process.env.tableName,
    KeyConditionExpression: 'PK = :pk AND SK = :sk',
    ExpressionAttributeValues: {
      ':pk': `THREAD#${threadId}`,
      ':sk': `THREAD#${threadId}`
    }
  };

  try {
    // Execute queries in parallel
    const [commentsData, threadData] = await Promise.all([
      ddbDocClient.send(new QueryCommand(commentParams)),
      ddbDocClient.send(new QueryCommand(threadParams))
    ]);

    const resArr = [
      ...(commentsData.Items || []), // Ensure comments.Items is an array or default to empty array
      ...(threadData.Items || [])   // Ensure thread.Items is an array or default to empty array
    ];

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(resArr)
    };
  } catch (error) {
    console.error('Error fetching data:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Could not fetch threads', details: error.message })
    };
  }
};

