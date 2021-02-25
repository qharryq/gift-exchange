# gift-exchange
How to run:
1. npm install
2. npm run start:dev

This is my implentation of a secret-santa API and backend, created using Express/Node/Typescript. It randomly matches family members with each other, with the constraint that family members cannot recieve a gift from the same person more than once every 3 years.

I have two DB tables to manage this (in the form of JSON files). The Members table stores basic information about each family member (id, email and name), while the GiftExchange table contains two columns: memberId (foreign key) and recentRecipientMemberIds (containing the last 2 family members they gifted to). 

The actual secret santa algorithm works as follows:

    1. It iterates through the family members (retrieved from the Members db).
    2. For each member it calculates the possible recipients remaining for them. (stored in shortlist array)
       It does this by looking at remainingRecipients array and looking up their previous recipients in the GiftExchange DB.
       Their recipients for the previous 2 years and their own member id are removed from their possible options.
       If a deadend is reached and there are no possible recipients for the member the entire process restarts at step 1.
    3. Otherwise the list of possible recipients are randomly shuffled and the first value is selected as the recipient.
    4. This resulting GiftExchange mapping is added to an array which keeps track of the pairs so far.
    5. That recipient is removed from remainingRecipients.
    6. the process continues until every member has been assigned a unique recipient or the max retries are surpassed,
       in which case an error is returned saying a selection could not be made with the current constraints.

    It's not a clever implementation as it works through sheer force/retries rather than graphs.

Things I would change:

- UNIT TESTS - I simply ran out of time

- Introduce the concept of different families by adding a separate Family table
