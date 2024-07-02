class ApplicationController < ActionController::Base
  rescue_from StandardError, :with => :handle_json_error_response

  def handle_json_error_response
    if request.headers['ACCEPT'] =~ /json/
      render :json => {:error => 'Unexpected error'}, :status => 500
    else
      raise $!
    end
  end
end
