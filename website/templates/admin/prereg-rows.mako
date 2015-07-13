<div class="row" data-bind="attr: {id: $index}, event: {mouseover: highlightRow}">
    <div data-bind="text: $data.registration_metadata.q1.value" class="col-md-1" id="submission_title"></div>
    <div data-bind="text: $data.initiator.fullname" class="col-md-1" id="name"></div>
    <div data-bind="text: $data.initiator.username" class="col-md-1" id="email"></div>
    <div data-bind="text: $data.initiated" class="col-md-1" id="begun"></div>
    <div data-bind="text: $data.updated" class="col-md-1" id="submitted"></div>
    <div data-bind="text: 'no'" class="col-md-1" id="new_comments"></div>
    <div data-bind="text: 'no'" class="col-md-1" id="comments_sent"></div>
    <div data-bind="text: 'no'" class="col-md-1" id="approved"></div>
    <div data-bind="text: 'no'" class="col-md-1" id="registered"></div>
    <div data-bind="text: 'no'" class="col-md-1" id="proof_of_pub"></div>
    <div data-bind="text: 'no'" class="col-md-1" id="payment_sent"></div>
    <div data-bind="text: 'none'" class="col-md-1" id="notes"></div>
</div>
