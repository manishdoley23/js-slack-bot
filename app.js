const { App } = require('@slack/bolt')

require('dotenv').config()

const app = new App({
	token: process.env.SLACK_BOT_TOKEN,
	signingSecret: process.env.SLACK_SIGNING_SECRET,
})

;(async () => {
	await app.start(process.env.PORT || 5000)
	console.log('Bot is up on port:', 5000)
})()

// app.action('button_abc_2', async ({ ack, body, client, logger }) => {
// 	// Acknowledge the button request
// 	await ack()

// 	try {
// 		// Call views.update with the built-in client
// 		const result = await client.views.update({
// 			// Pass the view_id
// 			view_id: body.view.id,
// 			// Pass the current hash to avoid race conditions
// 			hash: body.view.hash,
// 			// View payload with updated blocks
// 			view: {
// 				type: 'modal',
// 				// View identifier
// 				callback_id: 'view_1',
// 				title: {
// 					type: 'plain_text',
// 					text: 'Updated modal',
// 				},
// 				blocks: [
// 					{
// 						type: 'section',
// 						text: {
// 							type: 'plain_text',
// 							text: 'You updated the modal!',
// 						},
// 					},
// 					{
// 						type: 'image',
// 						image_url:
// 							'https://media.giphy.com/media/SVZGEcYt7brkFUyU90/giphy.gif',
// 						alt_text: 'Why?',
// 					},
// 				],
// 			},
// 		})
// 		logger.info(result)
// 	} catch (error) {
// 		logger.error(error)
// 	}
// })

app.action('button_click', async ({ body, ack, say }) => {
	console.log('body', body)

	// Acknowledge the action
	await ack()
	await say(`<@${body.user.id}> clicked the button`)
})

app.action({ action_id: 'actionId-0' }, async ({ body, ack, say, payload }) => {
	await ack()

	console.log('body.state.values', body.state.values)
	await say(
		`Hey, <@${body.user.id}> these are your opinions:- \n\n${body.state.values['cS6']['plain_text_input-action-1'].value} \n\n${body.state.values['jdAL']['plain_text_input-action-2'].value}`
	)
})

app.message(/survey/i, async ({ message, say }) => {
	await say({
		blocks: [
			{
				type: 'section',
				text: {
					type: 'mrkdwn',
					text: `*Hey <@${message.user}>, here's your quick survey 🥂*`,
				},
			},
			{
				type: 'input',
				element: {
					type: 'plain_text_input',
					multiline: true,
					action_id: 'plain_text_input-action-1',
				},
				label: {
					type: 'plain_text',
					text: `What were the top 5 insights from the expo that you'd want the product team to know?`,
					emoji: true,
				},
			},
			{
				type: 'input',
				optional: true,
				element: {
					type: 'plain_text_input',
					multiline: true,
					action_id: 'plain_text_input-action-2',
				},
				label: {
					type: 'plain_text',
					text: `Anything else you'd want to bring to the product team's attention? (Optional)`,
					emoji: true,
				},
			},
			{
				type: 'actions',
				elements: [
					{
						type: 'button',
						text: {
							type: 'plain_text',
							text: 'SUBMIT',
							emoji: true,
						},
						value: 'click_me_123',
						action_id: 'actionId-0',
					},
				],
			},
		],
		text: `Hey there <@${message.user}>!`,
	})
})

app.event('app_home_opened', async ({ event, client, context }) => {
	try {
		/* view.publish is the method that your app uses to push a view to the Home tab */
		const result = await client.views.publish({
			/* the user that opened your app's app home */
			user_id: event.user,

			/* the view object that appears in the app home*/
			view: {
				type: 'home',
				callback_id: 'home_view',

				/* body of the view */
				blocks: [
					{
						type: 'header',
						text: {
							type: 'plain_text',
							text: 'Welcome to the Shower bot 👀',
						},
					},
					{
						type: 'divider',
					},
					{
						type: 'section',
						text: {
							type: 'mrkdwn',
							text: "I take in input from you and show it in the chat. How's that for a survey bot",
						},
					},
				],
			},
		})
		console.log('result', result)
	} catch (error) {
		console.error(error)
	}
})
